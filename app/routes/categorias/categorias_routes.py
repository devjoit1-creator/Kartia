from flask import Blueprint, render_template, request, jsonify
from app.services.categorias import categorias_services
import mysql.connector.errors as error

bp_categorias = Blueprint('categorias', __name__)

@bp_categorias.get('/categorias')
def categorias():
    return render_template('tplCategorias/categorias.html')

@bp_categorias.get('/getCategorias')
def getCategorias():
    try:
        categorias = categorias_services.listCategorias()
        if categorias:
            return jsonify(categorias), 200
        
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500
    
@bp_categorias.get('/getCategoriasId/<id>')
def getCategoriasId(id):
    try:
        categoria = categorias_services.listCategoriasId(id)
        if categoria:
            return jsonify(categoria)
        
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500

@bp_categorias.post('/addCategoria')
def addCategoria():
    try:
        codCategoria = request.form.get("codCategoria")
        nomCategoria = request.form.get("nomCategoria")
        categorias_services.insertCategoria(codCategoria, nomCategoria)
        return jsonify({"message": "Categoria Creada Exitosamente"}), 201
    
    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500

@bp_categorias.post('/editCategoria')
def editCategoria():
    try:
        codCategoria = request.form.get("codCategoria")
        nomCategoria = request.form.get("nomCategoria")
        idCategoria = request.form.get("idCategoria")
        categorias_services.updateCategoria(codCategoria, nomCategoria, idCategoria)
        return jsonify({"message": "Categoria Actualizada Exitosamente"})
    
    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500
    
@bp_categorias.get('/deleteCategoria/<id>')
def deleteCategoria(id):
    try:
        categorias_services.deleteCategoria(id)
        return jsonify({"message": "Categoria Eliminada Exitosamente"})

    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500
