from app.database import db

#Metodo listar datos de usuario
def listarUsuarioNombre(nombre):
    usuario = None
    conn = db.connection()
    operation = """ SELECT * FROM usuarios WHERE usuario = %s """
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation, (nombre, ))
            usuario = cursor.fetchone()

        return usuario
    
    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise
    
    finally:
        conn.close()