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

#Metodo Insertar Nuevo Usuario
def insertUsuario(usuario, passwd, nomUsuario, rolId, isActive):
    conn = db.connection()
    operation = """ INSERT INTO usuarios (usuario, passwd, nomUsuario, rolId, isActive) VALUES (%s, %s, %s, %s, %s)"""
    params = (usuario, passwd, nomUsuario, rolId, isActive)
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation, params)
            conn.commit()

    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()