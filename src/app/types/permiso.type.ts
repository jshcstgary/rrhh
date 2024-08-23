export type LoginRequest = {
	codigoAplicacion: string;
	codigoPerfil: string;
	codigoRecurso: string;
	usuario: string;
	password: string;
	isAutenticacionLocal: boolean;

};

export type Perfil = {
	codigo: string;
	apellidos: string;
	nombres: string;
	email: string;
	vistas: Permiso[];
};

export type PerfilUsuarioResponse = PerfilUsuario[];

export type PerfilUsuario = {
	scg_per_codigo: string;
	scg_per_descripcion: string;
	message: string;
};

export type Permiso = {
	codigo: string;
	nombre: string;
	visualizar: boolean;
	nuevo: boolean;
	modificar: boolean;
	eliminar: boolean;
	exportar: boolean;
	procesar: boolean;
	consulta: boolean;
	controles: Control[];
}

export type Control = {
	codigo_Control: string;
	habilitar: boolean;
	modificar: boolean;
	visualizar: boolean;
}
