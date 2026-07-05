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

#Metodo Actualizar Usuario
def updateUsuario(usuario, passwd, nomUsuario, rolId, isActive, idUsuario):
    conn = db.connection()
    operation = """ UPDATE usuarios SET usuario = %s, passwd = %s, nomUsuario = %s, rolId = %s, isActive = %s WHERE idUsuario = %s"""
    params = (usuario, passwd, nomUsuario, rolId, isActive, idUsuario)
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

#Metodo Eliminar Usuario
def deleteUsuario(idUsuario):
    conn = db.connection()
    operation = """ DELETE FROM usuarios WHERE idUsuario = %s"""
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation, (idUsuario, ))
            conn.commit()

    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()

#Metodo Listar Usuarios
def listUsuarios():
    usuarios = []
    conn = db.connection()
    operation = """ SELECT idUsuario, usuario, nomUsuario FROM usuarios """
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation)
            for row in cursor.fetchall():
                usuarios.append({'idUsuario': row[0], 'usuario': row[1], 'nomUsuario': row[2]})

        return usuarios
    
    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()

#Metodo listar datos de usuario por ID
def listarUsuarioId(idUsuario):
    usuario = []
    conn = db.connection()
    operation = """ SELECT * FROM usuarios WHERE idUsuario = %s """
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation, (idUsuario, ))
            for row in cursor.fetchall():
                usuario.append({'idUsuario': row[0], 'usuario': row[1], 'passwd': row[2], 'nomUsuario': row[3], 'rolId': row[4], 'isActive': row[5]})

        return usuario
    
    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise
    
    finally:
        conn.close()