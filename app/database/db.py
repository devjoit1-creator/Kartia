import mysql.connector

def connection():
    user = 'root'
    password = ''
    host = 'localhost'
    database = 'db_kartia'
    port = 3306
    conexion = mysql.connector.connect(
        user = user,
        password = password,
        host = host,
        database = database,
        port = port
    )
    return conexion