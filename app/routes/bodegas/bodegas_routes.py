from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from app.services.bodegas import bodegas_service
import mysql.connector.errors as error

bp_bodegas = Blueprint("Bodegas", __name__)

@bp_bodegas.get('/bodegas')
def bodegas():
    return render_template('tplBodegas/bodegas.html')

@bp_bodegas.get('/getBodegas')
def getBodegas():
    try:
        bodegas = bodegas_service.listBodegas()
        return jsonify(bodegas), 200
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500

@bp_bodegas.get('/getBodegasId/<id>')
def getBodegasId(id):
    try:
        bodega = bodegas_service.listBodegaId(id)
        if bodega:
            return jsonify(bodega), 200
        else:
            return jsonify({"error": "No se encontró bodega"}), 404
        
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500

@bp_bodegas.post('/addBodega')
def addBodega():
    try:
        idBodega = request.form.get("idBodega")
        nomBodega = request.form.get("nomBodega")
        bodegas_service.insertBodega(idBodega, nomBodega)

        return jsonify({"message": "Bodega Creada Exitosamente"}), 201
    
    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500
    
@bp_bodegas.post('/editBodega')
def editBodega():
    try:
        nomBodega = request.form.get("nomBodega")
        idBodega = request.form.get("idBodega")
        bodegas_service.updateBodega(nomBodega, idBodega)
        
        return jsonify({"message": "Bodega Actualizada Exitosamente"}), 200
    
    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500
    
@bp_bodegas.get('/deleteBodega/<id>')
def deleteBodega(id):
    try:
        bodegas_service.deleteBodega(id)
        return jsonify({"message": "Bodega Eliminada Exisotamente"}), 200
    
    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500