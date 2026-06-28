from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from app.services.usuarios import perfilUsuarios_services
import mysql.connector.errors as error

bp_perfilUsuarios = Blueprint('perfilUsuarios', __name__)

@bp_perfilUsuarios.get('/perfilUsuarios')
def perfilUsuarios():
    return render_template('tplPerfilesUsuario/perfilesUsuario.html')

@bp_perfilUsuarios.get('/getPerfiles')
def getPerfiles():
    try:
        perfiles = perfilUsuarios_services.listPerfiles()
        return jsonify(perfiles), 200
        
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500
    
@bp_perfilUsuarios.get('/getPerfilId/<id>')
def getPerfilId(id):
    try:
        perfil = perfilUsuarios_services.listPerfilesId(id)
        if perfil:
            return jsonify(perfil), 200
        else:
            return jsonify({"error": "No se encontró perfil"}), 404
        
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500
    
@bp_perfilUsuarios.post('/addPerfil')
def addPerfil():
    try:
        nomRol = request.form.get("nomRol")
        descripcionRol = request.form.get("descripcionRol")
        perfilUsuarios_services.insertPerfil(nomRol, descripcionRol)
        return jsonify({"message": "Perfil Creado Exitosamente"})
    
    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500
    
@bp_perfilUsuarios.post('/editPerfil')
def editPerfil():
    try:
        nomRol = request.form.get("nomRol")
        descripcionRol = request.form.get("descripcionRol")
        idRol = request.form.get("idRol")
        perfilUsuarios_services.updatePerfil(nomRol, descripcionRol, idRol)
        return jsonify({"message": "Perfil Actualizado Exitosamente"}), 200
    
    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500
    
@bp_perfilUsuarios.get('/deletePerfil/<id>')
def deletePerfil(id):
    try:
        perfilUsuarios_services.deletePerfil(id)
        return jsonify({"message": "Perfil Eliminado Exitosamente"}), 200
    
    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500