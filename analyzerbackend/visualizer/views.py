from django.db import models
from django.http import QueryDict
from django.views.decorators.http import require_GET, require_POST
from django.http import HttpResponse, QueryDict, JsonResponse
from django.contrib.auth import authenticate, login

from google.cloud import bigquery
from django.http import JsonResponse
from django.conf import settings
from django.db import transaction
from django.contrib.auth.models import User

import pandas as pd
import os
import json
from .auth import hash_password, verify_password
import uuid
import numpy as np

csv_storage = settings.CSV_STORAGE

import re

def clean_bq_column_name(column_names):

    cleaned_column_name_list = []

    for column_name in column_names:
        # Ensure the column starts with a letter or underscore
        if not column_name[0].isalpha() and column_name[0] != '_':
            column_name = '_' + column_name
        
        # Replace any non-alphanumeric (except _) character with '_'
        cleaned_name = re.sub(r'[^0-9a-zA-Z_]', '_', column_name)
        
        # Ensure the name is no longer than 128 characters
        cleaned_name = cleaned_name[:128]
        
        cleaned_column_name_list.append(cleaned_name)

    return cleaned_column_name_list

@require_POST
def register(request):
    try:
        data = json.loads(request.body)
        print(data, "dtaa")

        table_id = f"{settings.BIG_QUERY_DB_ID}users"

        encrypted_password = hash_password(data["password"])

        rows = [{"id": str(uuid.uuid4()), "username": data["username"], "password":encrypted_password}]

        client = bigquery.Client()

        # get User table
        user_table = client.get_table(table_id)
        print(user_table, "usertable")

        schema = [
            bigquery.SchemaField("id", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("username", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("password", "STRING", mode="REQUIRED"),
        ]

        # check if the user name is already present in the database
        select_username_query = f"""SELECT username FROM `{table_id}` WHERE username='{data["username"]}'"""
        print(select_username_query, "select username")
        query_job = client.query(select_username_query)  # API request
        result = query_job.result()

        for rows in result:
            if rows:
                return HttpResponse("Username already present", status=500)

        errors = client.insert_rows(table_id, rows, schema)

        if errors:
            return HttpResponse("Internal Server Error", status=500)
        else:
            return HttpResponse("Registered successfully")
    except Exception as e:
        print(e, "erros")
        return HttpResponse("Internal Server Error", status=500)
        
@require_POST
def login(request):
    data = json.loads(request.body)

    client = bigquery.Client()

    table_id = f"{settings.BIG_QUERY_DB_ID}users"

    # check if the user name is already present in the database
    select_username_query = f"""SELECT * FROM `{table_id}` WHERE username='{data["username"]}'"""
    query_job = client.query(select_username_query)  # API request
    result = query_job.result()

    for row in result:
        if row:
            authentication = verify_password(data["password"], row["password"])
            if authentication:
                return JsonResponse({"user_id": row["id"]})
            else:
                return HttpResponse("Login Unsuccessful", status=401)
        else:
            return HttpResponse("User not found", status=401)

def upload_files(request):
    data = QueryDict.dict(request.POST)
    uploaded_files = request.FILES.getlist('file')

    table_name = data.get("table_name", None)
    user_id = data.get("user_id", None)

    for files in uploaded_files:
        file_storage_path = csv_storage + files.name
        with open(file_storage_path, 'wb+') as f:
            f.write(files.read())

        pandas_dataframe = pd.read_csv(file_storage_path)
        cleaned_dataframe_labels = clean_bq_column_name(pandas_dataframe.columns)
        pandas_dataframe.columns = cleaned_dataframe_labels

        # Construct a BigQuery client object.
        client = bigquery.Client()
        table_id = f"{settings.BIG_QUERY_DB_ID}{table_name}"
        table = client.load_table_from_dataframe(pandas_dataframe, table_id)  # Make an API request.

        # create a entry in the dataset table
        dataset_table_id = f"{settings.BIG_QUERY_DB_ID}datasets"
        dataset_table_schema = [
            bigquery.SchemaField("id", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("dataset_name", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("user_id", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("dashboard_preferences", "JSON", mode="REQUIRED"),
        ]

        dataset_id = str(uuid.uuid4())
        user_dashboard_table_rows = [{"id": dataset_id, "dataset_name": table_name, "user_id": str(user_id).strip('"'), "dashboard_preferences": {}}]

        errors = client.insert_rows(dataset_table_id, user_dashboard_table_rows, dataset_table_schema)

        os.remove(file_storage_path)

        return JsonResponse(data={"dataset_id": dataset_id})
    
def get_chart_data(request):

    print(request.GET, "get")

    feature_list_string = request.GET.get("feature_list", None)
    chart_choice = request.GET.get("chart_choice", None)
    table_name = request.GET.get("table_name", None)

    # Construct a BigQuery client object.
    client = bigquery.Client()

    # TODO(developer): Set table_id to the ID of the table to create.
    table_id = f"{settings.BIG_QUERY_DB_ID}{table_name}"

    # Define a query to fetch rows
    query = f"SELECT {feature_list_string if feature_list_string else '*'} FROM `{table_id}` LIMIT 10"  # Adjust LIMIT as needed

    # Execute the query
    query_job = client.query(query)

    # Process the results
    results = query_job.result()  # This returns a BigQuery RowIterator

    headers = [field.name for field in results.schema]

    rows = [list(row.values()) for row in results]
    chart_data = [headers] + rows

    return JsonResponse(data = {"data": chart_data})

# def get_feature_list(request):
#     table_name = request.GET.get("table_name", None)

#     client = bigquery.Client()

#     table_id = f"{settings.BIG_QUERY_DB_ID}{table_name}"

#     # Get table metadata
#     table = client.get_table(table_id)

#     # Extract column names from the schema
#     column_names = [field.name for field in table.schema]

#     return JsonResponse(data = {"data": column_names})

def create_init_tables(request):

    client = bigquery.Client()

    # user table creation
    user_table_id = f"{settings.BIG_QUERY_DB_ID}users"
    user_table_schema = [
        bigquery.SchemaField("id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("username", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("password", "STRING", mode="REQUIRED"),
    ]

    user_table_object = bigquery.Table(user_table_id, schema=user_table_schema)
    user_table = client.create_table(user_table_object)

    dataset_table_id = f"{settings.BIG_QUERY_DB_ID}datasets"
    dataset_table_schema = [
        bigquery.SchemaField("id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("dataset_name", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("user_id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("dashboard_preferences", "JSON", mode="REQUIRED"),
    ]
    dataset_table_object = bigquery.Table(dataset_table_id, schema=dataset_table_schema)
    dataset_table = client.create_table(dataset_table_object)

    preferences_id = f"{settings.BIG_QUERY_DB_ID}preferences"
    preferences_schema = [
        bigquery.SchemaField("id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("dataset_id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("dashboard_preferences", "JSON", mode="REQUIRED"),
    ]
    preferences_object = bigquery.Table(preferences_id, schema=preferences_schema)
    preferences_table = client.create_table(preferences_object)

    return HttpResponse("Init tables created successfully") 

@require_POST
def save_dashboard_preferences(request):
    data = json.loads(request.body)

    client = bigquery.Client()

    # create a entry in the dataset table
    preference_table_id = f"{settings.BIG_QUERY_DB_ID}preferences"
    preference_table_schema = [
        bigquery.SchemaField("id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("dataset_id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("dashboard_preferences", "JSON", mode="REQUIRED"),
    ]

    rows = [{"id": str(uuid.uuid4()), "dataset_id": data["dataset_id"], "dashboard_preferences": data["dashboard_preferences"]}]

    errors = client.insert_rows(preference_table_id, rows, preference_table_schema)

    # dataset_table_id = f"{settings.BIG_QUERY_DB_ID}datasets"
    # dashboard_preferences_json = json.dumps(data["dashboard_preferences"])
    # # dashboard_preferences_json = data["dashboard_preferences"]
    
    # # SQL Query to update a specific row
    # query = f"""
    # UPDATE `{dataset_table_id}`
    # SET dashboard_preferences = @dashboard_preferences
    # WHERE dataset_name = '{data["dataset_name"]}' AND user_id = '{data["user_id"]}'
    # """

    # # Configure the query parameters
    # job_config = bigquery.QueryJobConfig(
    #     query_parameters=[
    #         bigquery.ScalarQueryParameter("dashboard_preferences", "JSON", dashboard_preferences_json),
    #     ]
    # )

    # # Run the query
    # query_job = client.query(query, job_config=job_config)

    # # Wait for the query to complete
    # query_job.result()

    return HttpResponse("Dashboard preferences saved successfully")

def getDatasetList(request):
    user_id = request.GET.get("user_id", None)

    client = bigquery.Client(project='lively-cumulus-435922-v8')

    table_id = f"{settings.BIG_QUERY_DB_ID}datasets"
    print(table_id, "table id")

    select_query = f"""SELECT id, dataset_name FROM `{table_id}` WHERE user_id='{user_id}'"""

    query_job = client.query(select_query)  # API request
    result = query_job.result()

    dataset_list = [{"id": rows["id"], "name": rows["dataset_name"]} for rows in result]

    return JsonResponse({"data": dataset_list})

def get_feature_list(request):
    dataset_name = request.GET.get("dataset_name", None)

    client = bigquery.Client()
    table_id = f"{settings.BIG_QUERY_DB_ID}{dataset_name}"

    # Get table metadata
    table = client.get_table(table_id)

    # Extract column names from the schema
    all_column_names = [field.name for field in table.schema]
    integer_only_column_names = [field.name for field in table.schema if(field.field_type=="INTEGER")]

    return JsonResponse(data = {"all_names": all_column_names, "integer_names": integer_only_column_names})

@require_POST
def getLinechartData(request):
    data = json.loads(request.body)

    dataset_name = data.get('dataset_name', None)
    preferences = data.get('preferences', None)

    category = preferences.get('lineChartCategory', None)
    dependent_1 = preferences.get('lineChartDependent1', None)
    dependent_2 = preferences.get('lineChartDependent2', None)
    dependent_3 = preferences.get('lineChartDependent3', None)

    # Initialize a BigQuery client
    client = bigquery.Client(project='lively-cumulus-435922-v8')

    # Define your BigQuery table
    table_id = f"{settings.BIG_QUERY_DB_ID}{dataset_name}"

    # Load the table into a DataFrame
    query = f"SELECT * FROM `{table_id}` LIMIT 10"
    df = client.query(query).to_dataframe()
    df = df.replace({np.nan: None})

    label_mapping = {
        category : 'category',
        dependent_1: 'dependent_1',
        dependent_2 :'dependent_2',
        dependent_3: 'dependent_3'
    }

    data = df[[category, dependent_1, dependent_2, dependent_3]].rename(columns=label_mapping).to_dict(orient='records')

    label_reverse_mapping = {
        'category' : category,
        'dependent_1': dependent_1,
        'dependent_2' :dependent_2,
        'dependent_3': dependent_3
    }
    # return JsonResponse(data={"data": data})
    return JsonResponse(data={"data": data, "label_mapping": label_reverse_mapping})

@require_POST
def getBarChartData(request):
    data = json.loads(request.body)

    dataset_name = data.get('dataset_name', None)
    preferences = data.get('preferences', None)

    category = preferences.get('barChartCategory', None)
    dependent_1 = preferences.get('barChartDependent1', None)
    dependent_2 = preferences.get('barChartDependent2', None)
    dependent_3 = preferences.get('barChartDependent3', None)

    # Initialize a BigQuery client
    client = bigquery.Client(project='lively-cumulus-435922-v8')

    # Define your BigQuery table
    table_id = f"{settings.BIG_QUERY_DB_ID}{dataset_name}"

    # Load the table into a DataFrame
    query = f"SELECT * FROM `{table_id}` LIMIT 10"
    df = client.query(query).to_dataframe()
    df = df.replace({np.nan: None})

    df_selected = df[[category, dependent_1, dependent_2, dependent_3]]

    print(df_selected, "df")
    # cluster_name = "cluster-ad18"  # Replace with your Dataproc cluster name
    # region = "us-central1"  # Replace with the region where your Dataproc cluster is running
    # project_id = "lively-cumulus-435922-v8"  # Replace with your Google Cloud project ID

    # # Initialize a Spark session
    # spark = SparkSession.builder.appName("DjangoSparkAPI")\
    #     .config("spark.dataproc.project.id", project_id) \
    #     .config("spark.dataproc.region", region) \
    #     .config("spark.dataproc.cluster", cluster_name) \
    #     .getOrCreate()
    
    # print(spark, "sparked")

    # spark.sparkContext.setLogLevel("DEBUG")

    # # Convert Pandas DataFrame to Spark DataFrame
    # spark_df = spark.createDataFrame(df_selected)

    # # Perform sampling (select ~10 random rows)
    # sampled_spark_df = spark_df.sample(fraction=10 / len(df), seed=42).limit(10)

    # # Convert back to Pandas DataFrame for Django response
    # sampled_df = sampled_spark_df.toPandas()


    # category_data = df[category].tolist()
    # dependent_1 = df[dependent_1].tolist()
    # dependent_2 = df[dependent_2].tolist()
    # dependent_3 = df[dependent_3].tolist()

    label_mapping = {
        category : 'category',
        dependent_1: 'dependent_1',
        dependent_2 :'dependent_2',
        dependent_3: 'dependent_3'
    }

    data = df_selected.rename(columns=label_mapping).to_dict(orient='records')

    label_reverse_mapping = {
        'category' : category,
        'dependent_1': dependent_1,
        'dependent_2' :dependent_2,
        'dependent_3': dependent_3
    }

    # return JsonResponse(data={"category_data": category_data, "dependent_1": dependent_1,
    #                           "dependent_2": dependent_2, "dependent_3": dependent_3})

    return JsonResponse(data={"data": data, "label_mapping": label_reverse_mapping})

def get_dashboard_data(request):
    dataset_id = request.GET.get("dataset_id", None)

    client = bigquery.Client(project='lively-cumulus-435922-v8')

    table_id = f"{settings.BIG_QUERY_DB_ID}preferences"

    select_query = f"""SELECT id, dashboard_preferences FROM `{table_id}` WHERE dataset_id='{dataset_id}'"""

    query_job = client.query(select_query)  # API request
    result = query_job.result()

    dataset_list = [rows["dashboard_preferences"] for rows in result]
    dataset_list = dataset_list[0]

    return JsonResponse({"data": dataset_list})

