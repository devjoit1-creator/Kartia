from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_bcrypt import Bcrypt
from app.services.usuarios import usuarios_services, perfilUsuarios_services
import mysql.connector.errors as error

bp_usuarios = Blueprint('usuarios', __name__)
bcrypt = Bcrypt()

@bp_usuarios.get('/usuarios')
def usuarios():
    perfiles = perfilUsuarios_services.listPerfiles()
    return render_template('tplUsuarios/usuarios.html', perfiles = perfiles)

@bp_usuarios.post('/addUsuario')
def addUsuario():
    try:
        usuario = request.form.get("usuario")
        passwd = bcrypt.generate_password_hash(request.form.get("passwd"))
        nomUsuario = request.form.get("nomUsuario")
        rolId = request.form.get("rolId")
        isActive = request.form.get("isActive")
        usuarios_services.insertUsuario(usuario, passwd, nomUsuario, rolId, isActive)
        return jsonify({"message": "Usuario Creado Exitosamente"}), 201
    
    except error.Error as e:
        return jsonify({"error": f"{e.msg}"}), 500
    
    except Exception as ex:
        return jsonify({"error": f"{ex}"}), 500