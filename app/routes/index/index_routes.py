from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from flask_bcrypt import Bcrypt
from app.services.usuarios import usuarios_services
import mysql.connector.errors as error

bp_index = Blueprint("Index", __name__)
bcrypt = Bcrypt()

@bp_index.get('/')
def index():
    session.clear()
    return render_template("login.html")

@bp_index.post('/loginAccess')
def loginAccess():
    try:
        usuario = request.form["userId"]
        contrasena = request.form["userPass"]

        user = usuarios_services.listarUsuarioNombre(usuario)
        passwd = user[2]

        if len(user) > 0:
            if bcrypt.check_password_hash(passwd, contrasena):
                session['name'] = user[1]
                session['profile'] = user[4]
                session['status'] = user[5]

                if session['profile'] != 0:
                    return redirect(url_for('Index.main'))
                
            else:
                flash("Usuario y/o Contraseña Incorrectas", "warning")
                return render_template("login.html")
            
        else:
            flash("Usuario no existe. \n " \
            "Pongase en contacto con el administrador del sistema", "error")
            return render_template("login.html")
        
    except TypeError:
        flash("Usuario no existe. \n " \
        "Pongase en contacto con el administrador del sistema", "error")
        return render_template("login.html")
    
    except error.Error as e:
        flash(f"Se presentó un error inesperado: {e.msg}", "error")
        return render_template("login.html")
    
@bp_index.get('/logout')
def logout():
    session.clear()
    return render_template("login.html")

@bp_index.get('/main')
def main():
    return render_template("main.html")
