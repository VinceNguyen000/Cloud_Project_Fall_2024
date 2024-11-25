from django.db import models
from django.http import QueryDict

from google.cloud import bigquery
from django.http import JsonResponse
from django.conf import settings

import pandas as pd
import os

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

def upload_files(request):
    data = QueryDict.dict(request.POST)
    uploaded_files = request.FILES.getlist('file')

    table_name = data.get("table_name", None)

    for files in uploaded_files:
        file_storage_path = csv_storage + files.name
        with open(file_storage_path, 'wb+') as f:
            f.write(files.read())

        pandas_dataframe = pd.read_csv(file_storage_path)
        
        cleaned_dataframe_labels = clean_bq_column_name(pandas_dataframe.columns)
        pandas_dataframe.columns = cleaned_dataframe_labels

        # Construct a BigQuery client object.
        client = bigquery.Client()

        # TODO(developer): Set table_id to the ID of the table to create.
        table_id = f"{settings.BIG_QUERY_DB_ID}{table_name}"

        # table = bigquery.Table(table_id, schema=schema)
        table = client.load_table_from_dataframe(pandas_dataframe, table_id)  # Make an API request.

        os.remove(file_storage_path)

        return JsonResponse(data={"data": "Uploaded successfully"})
    
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

def get_feature_list(request):
    table_name = request.GET.get("table_name", None)

    client = bigquery.Client()

    table_id = f"{settings.BIG_QUERY_DB_ID}{table_name}"

    # Get table metadata
    table = client.get_table(table_id)

    # Extract column names from the schema
    column_names = [field.name for field in table.schema]

    return JsonResponse(data = {"data": column_names})

