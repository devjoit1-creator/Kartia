from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from app.services.bodegas import bodegas_service
import mysql.connector.errors as error

bp_bodegas = Blueprint("Bodegas", __name__)

@bp_bodegas.get('/bodegas')
def bodegas():
    return render_template('tplBodegas/bodegas.html')

@bp_bodegas.post('/addBodega')
def addBodega():
    try:
        data = request.get_json()
        idBodega = data.get("id")
        nomBodega = data.get("nombre")
        bodegas_service.insertBodega(idBodega, nomBodega)

        return jsonify({"message": "Bodega Creada Exitosamente"}), 201
    
    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500