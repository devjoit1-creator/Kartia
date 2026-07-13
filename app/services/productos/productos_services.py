from app.database import db

#Metodo Insertar Producto
def insertProducto(codProducto, codBarraProducto, nomProducto, descripcionProducto, precioCompra,
                   precioVenta, stockMinimo, stockMaximo, categoriaId):
    
    conn = db.connection()
    operation = """ INSERT INTO productos (codProducto, codBarraProducto, nomProducto, descripcionProducto, precioCompra,
                   precioVenta, stockMinimo, stockMaximo, categoriaId)
                   VALUES
                   (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    
    params = (codProducto, codBarraProducto, nomProducto, descripcionProducto, precioCompra,
              precioVenta, stockMinimo, stockMaximo, categoriaId)
    
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

#Metodo Actualizar Producto
def updateProducto(codProducto, codBarraProducto, nomProducto, descripcionProducto, precioCompra,
                   precioVenta, stockMinimo, stockMaximo, categoriaId, idProducto):
    conn = db.connection()
    operation = """ UPDATE productos SET codProducto = %s, codBarraProducto = %s, nomProducto = %s, descripcionProducto = %s, precioCompra = %s,
                   precioVenta = %s, stockMinimo = %s, stockMaximo = %s, categoriaId = %s WHERE idProducto = %s"""
    
    params = (codProducto, codBarraProducto, nomProducto, descripcionProducto, precioCompra,
              precioVenta, stockMinimo, stockMaximo, categoriaId, idProducto)
    
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

#Metodo Eliminar Producto
def deleteProducto(idProducto):
    conn = db.connection()
    operation = """ DELETE FROM productos WHERE idProducto = %s"""
    try:
        with conn.cursor() as cursor:
            cursor.execute(operation, (idProducto, ))
            conn.commit()

    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()

#Metodo Listar Productos
def listProductos():
    productos = []
    conn = db.connection()
    operation = """ SELECT idProducto, codProducto, nomProducto FROM productos """
    try: 
        with conn.cursor() as cursor:
            cursor.execute(operation)
            for row in cursor.fetchall():
                productos.append({
                    'idProducto': row[0], 
                    'codProducto': row[1], 
                    'nomProducto': row[2]
                })

        return productos
    
    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()

#Metodo Listar Productos por id
def listProductosId(idProducto):
    producto = []
    conn = db.connection()
    operation = """ SELECT * FROM productos WHERE idProducto = %s"""
    try: 
        with conn.cursor() as cursor:
            cursor.execute(operation, (idProducto, ))
            for row in cursor.fetchall():
                producto.append({
                    'idProducto': row[0], 
                    'codProducto': row[1], 
                    'codBarraProducto': row[2], 
                    'nomProducto': row[3], 
                    'descripcionProducto': row[4], 
                    'precioCompra': row[5],
                    'precioVenta': row[6], 
                    'stockMinimo': row[7], 
                    'stockMaximo': row[8], 
                    'categoriaId': row[9], 
                })

        return producto
    
    except Exception as ex:
        print(f"Se presentó un error inesperado: {ex}")
        conn.rollback()
        raise

    finally:
        conn.close()