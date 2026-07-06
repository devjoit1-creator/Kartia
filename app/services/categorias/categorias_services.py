from app.database import db

#Metodo Nueva Categoria
def insertCategoria(codCategoria, nomCategoria):
    conn = db.connection()
    operation = """ INSERT INTO categorias (codCategoria, nomCategoria) VALUES (%s, %s)"""
    params = (codCategoria, nomCategoria)
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

#Metodo Actualizar Categoria
def updateCategoria(codCategoria, nomCategoria, idCategoria):
    conn = db.connection()
    operation = """ UPDATE categorias SET codCategoria = %s, nomCategoria = %s WHERE idCategoria = %s"""
    params = (codCategoria, nomCategoria, idCategoria)
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

#Metodo Eliminar Categoria
def deleteCategoria(idCategoria):
    conn = db.connection()
    operation = """ DELETE FROM categorias WHERE idCategoria = %s"""
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation, (idCategoria, ))
            conn.commit()

    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()

#Metodo Listar Categorias
def listCategorias():
    categorias = []
    conn = db.connection()
    operation = """ SELECT idCategoria, codCategoria, nomCategoria FROM categorias """
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation)
            for row in cursor.fetchall():
                categorias.append({'idCategoria': row[0], 'codCategoria': row[1], 'nomCategoria': row[2]})

        return categorias

    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()

#Metodo Listar categoria por ID
def listCategoriasId(idCategoria):
    categoria = []
    conn = db.connection()
    operation = """ SELECT * FROM categorias WHERE idCategoria = %s """
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation, (idCategoria, ))
            for row in cursor.fetchall():
                categoria.append({'idCategoria': row[0], 'codCategoria': row[1], 'nomCategoria': row[2]})

        return categoria

    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()