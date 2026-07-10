from app.database import db

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