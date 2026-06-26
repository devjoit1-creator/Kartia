from app.database import db

#Metodo Insert Bodega
def insertBodega(idBodega, nomBodega):
    conn = db.connection()
    operation = """ INSERT INTO bodegas (idBodega, nomBodega) VALUES (%s, %s)"""
    params = (idBodega, nomBodega)
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

#Metodo Update Bodega
def updateBodega(nomBodega, idBodega):
    conn = db.connection()
    operation = """ UPDATE bodegas SET nomBodega = %s WHERE idBodega = %s """
    params = (nomBodega, idBodega)
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

#Metodo Delete Bodega
def deleteBodega(idBodega):
    conn = db.connection()
    operation = """ DELETE FROM bodegas WHERE idBodega = %s """
    try: 
        with conn.cursor() as cursor:
            cursor.execute(operation, (idBodega, ))
            conn.commit()

    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()

#Metodo Listar Bodegas
def listBodegas():
    bodegas = []
    conn = db.connection()
    operation = """ SELECT idBodega, nomBodega FROM bodegas """
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation)
            for row in cursor.fetchall():
                bodegas.append({'idBodega': row[0], 'nomBodega': row[1]})

        return bodegas
    
    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()

#Metodo Listar Bodega por ID
def listBodegaId(idBodega):
    bodega = []
    conn = db.connection()
    operation = """ SELECT * FROM bodegas WHERE idBodega = %s """
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation, (idBodega, ))
            for row in cursor.fetchall():
                bodega.append({'idBodega': row[0], 'nomBodega': row[1]})

        return bodega
    
    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()