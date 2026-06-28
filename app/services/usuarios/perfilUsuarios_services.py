from app.database import db

#Metodo Nuevo Perfil Usuario
def insertPerfil(nomRol, descripcionRol):
    conn = db.connection()
    operation = """ INSERT INTO roles (nomRol, descripcionRol) VALUES (%s, %s)"""
    params = (nomRol, descripcionRol)
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

#Metodo Actualizar datos de Perfil Usuario
def updatePerfil(nomRol, descripcionRol, idRol):
    conn = db.connection()
    operation = """ UPDATE roles SET nomRol = %s, descripcionRol = %s WHERE idRol = %s """
    params = (nomRol, descripcionRol, idRol)
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

#Metodo Eliminar Perfil Usuario
def deletePerfil(idRol):
    conn = db.connection()
    operation = """ DELETE FROM roles WHERE idRol = %s """
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation, (idRol, ))
            conn.commit()

    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()

#Metodo listar todos Perfiles de Usuario
def listPerfiles():
    perfiles = []
    conn = db.connection()
    operation = """ SELECT idRol, nomRol, descripcionRol FROM roles """
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation)
            for row in cursor.fetchall():
                perfiles.append({'idRol': row[0], 'nomRol': row[1], 'descripcionRol': row[2]})

        return perfiles
    
    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()

#Metodo listar datos de usuarios por id
def listPerfilesId(idRol):
    perfil = []
    conn = db.connection()
    operation = """ SELECT * FROM roles WHERE idRol = %s """
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation, (idRol, ))
            for row in cursor.fetchall():
                perfil.append({'idRol': row[0], 'nomRol': row[1], 'descripcionRol': row[2]})

        return perfil
    
    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()