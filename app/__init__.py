from flask import Flask, render_template, request, session, flash
from flask_bcrypt import Bcrypt

from app.routes.index.index_routes import bp_index
from app.routes.usuarios.perfilUsuarios_routes import bp_perfilUsuarios
from app.routes.usuarios.usuarios_routes import bp_usuarios
from app.routes.bodegas.bodegas_routes import bp_bodegas
from app.routes.categorias.categorias_routes import bp_categorias
from app.routes.productos.productos_routes import bp_productos


def create_new():
    app = Flask(__name__, template_folder='templates')
    app.secret_key = "S3Cr37_K3&"
    bcrypt = Bcrypt(app)

    #Registro de Blueprints
    app.register_blueprint(bp_index)
    app.register_blueprint(bp_perfilUsuarios)
    app.register_blueprint(bp_usuarios)
    app.register_blueprint(bp_bodegas)
    app.register_blueprint(bp_categorias)
    app.register_blueprint(bp_productos)

    @app.before_request
    def verify():
        ruta = request.path
        if not 'name' in session and ruta != "/" and ruta != "/loginAccess" and not ruta.startswith("/static"):
            flash("Debe iniciar sesion.", "warning")
            return render_template("login.html")

    return app

application = create_new()