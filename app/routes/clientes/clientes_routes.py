from flask import Blueprint, render_template, request, jsonify
from app.services.clientes import clientes_services
import mysql.connector.errors as error

bp_clientes = Blueprint('clientes', __name__)

@bp_clientes.get('/clientes')
def clientes():
    return render_template('tplClientes/clientes.html')