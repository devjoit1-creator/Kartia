from flask import Blueprint, render_template, request, jsonify
from app.services.productos import productos_services
from app.services.categorias import categorias_services
import mysql.connector.errors as error

bp_productos = Blueprint('productos', __name__)

@bp_productos.get('/productos')
def productos():
    categorias = categorias_services.listCategorias()
    return render_template('tplProductos/productos.html', categorias = categorias)

@bp_productos.get('/getProductos')
def getProductos():
    try:
        productos = productos_services.listProductos()
        if productos:
            return jsonify(productos), 200
        
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500

@bp_productos.get('/getProductosId/<id>')
def getProductosId(id):
    try:
        producto = productos_services.listProductosId(id)
        if producto:
            return jsonify(producto), 200
        
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500

@bp_productos.post('/addProducto')
def addProducto():
    try:
        codProducto = request.form.get("codProducto")
        codBarraProducto = request.form.get("codBarraProducto")
        nomProducto = request.form.get("nomProducto")
        descripcionProducto = request.form.get("descripcionProducto")
        precioCompra = request.form.get("precioCompra")
        precioVenta = request.form.get("precioVenta")
        stockMinimo = request.form.get("stockMinimo")
        stockMaximo = request.form.get("stockMaximo")
        categoriaId = request.form.get("categoriaId")
        productos_services.insertProducto(codProducto, codBarraProducto, nomProducto, descripcionProducto,
                                          precioCompra, precioVenta, stockMinimo, stockMaximo, categoriaId)
        
        return jsonify({"message": "Producto Creado Exitosamente"}), 201
    
    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500

@bp_productos.post('/updateProducto')
def updateProducto():
    try:
        codProducto = request.form.get("codProducto")
        codBarraProducto = request.form.get("codBarraProducto")
        nomProducto = request.form.get("nomProducto")
        descripcionProducto = request.form.get("descripcionProducto")
        precioCompra = request.form.get("precioCompra")
        precioVenta = request.form.get("precioVenta")
        stockMinimo = request.form.get("stockMinimo")
        stockMaximo = request.form.get("stockMaximo")
        categoriaId = request.form.get("categoriaId")
        idProducto = request.form.get("idProducto")
        productos_services.updateProducto(codProducto, codBarraProducto, nomProducto, descripcionProducto,
                                          precioCompra, precioVenta, stockMinimo, stockMaximo, categoriaId, idProducto)
        
        return jsonify({"message": "Producto Actualizado Exitosamente"}), 200
    
    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500
    
@bp_productos.get('/deleteProducto/<id>')
def deleteProducto(id):
    try:
        productos_services.deleteProducto(id)
        return jsonify({"message": "Producto Eliminado Exitosamente"}), 200

    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500