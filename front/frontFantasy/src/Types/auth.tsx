//          ***** DOCUMENTO DE TIPOS PARA AUTENTICACI�N(INTERFACES) *****
// Este archivo define las interfaces y tipos necesarios para la autenticaci�n en tu aplicaci�n.
// FALTAN A�ADIR MAS PROPIEDADES SEG�N MI API


// DTO para el registro (lo que env�as a la API)
export interface RegisterDto {
    NombreUsuario: string;
    EmailUsuario: string;
    Password: string;
}

// DTO para el login (lo que env�as a la API)
export interface LoginDto {
    EmailUsuario: string; // Tu API usa 'email' para el login, no 'username'
    Password: string;
}

// Interfaz para la informaci�n del usuario que la API devuelve tras el login
export interface UserData {
    // Estas propiedades provienen de los 'claims' dentro del JWT.
    // Los nombres de los claims en el token pueden ser largos URLs si no los mapeaste.
    // Si tu API usa los claims est�ndar de ASP.NET Identity, los nombres largos ser�n:
    id: string;        // Mapea a ClaimTypes.NameIdentifier (Guid)
    username: string;  // Mapea a ClaimTypes.Name (NombreUsuario)
    email: string;     // Mapea a ClaimTypes.EmailAddress (EmailUsuario)
    rolId?: string;    // Mapea al claim "RolId" (si tu API lo est� incluyendo as�)
    rol?: string;      // Mapea a ClaimTypes.Role (Nombre del Rol)
    // Otros claims que tu API pueda incluir en el token
    // Por ejemplo, si incluyes la fecha de registro en el token:
    // fechaRegistro?: string;
}

// Respuesta esperada del endpoint de login
export interface LoginResponse {
    token: string;
    emailUsuario: string;
    mensaje?: string; // Opcional, si tu API devuelve un mensaje
}

// Esta DTO es para el perfil de usuario, que se obtiene al llamar al endpoint de perfil
// Respuesta esperada del endpoint de perfil (seg�n tu UsuarioDto en .NET)
export interface UsuarioLigaDto {
    nombreLiga: string;
}

export interface UserProfileDto {
    nombreUsuario: string;
    emailUsuario: string;
    usuarioLigas: UsuarioLigaDto[];
}

export interface equiposDto {
    equipoId: number;
    nombreEquipo: string;
    estadio: string;
    imagenURL: string
}

export interface jugadoresPorID {
    nombreJugador: string;
    precioJugador: number;
    nacionalidad: string;
    nombreEquipo: string;
    puntosJugador: number;
}

// src/Types/player.d.ts

// Update this to match your C# JugadoresDTO
export interface PlayerDisplayData {
    jugadorId: number; // Corresponds to JugadorId
    nombreJugador: string; // Corresponds to NombreJugador
    posicion: string; // Corresponds to Posicion
    precioJugador: number; // Corresponds to PrecioJugador
    nombreEquipo: string; // Corresponds to NombreEquipo
    puntosJugador: number; // Corresponds to PuntosJugador
    nacionalidad: string | null;
    equipoId: number;
}

// Your CrearLigaResponseDto can remain simple if it just confirms success
export interface CrearLigaResponseDto {
    ligaId: string;
    exito: boolean;
    mensaje: string;
    // No need for ligaId here if CrearLiga doesn't return it and we're using mi-plantilla
}

export interface JoinLeagueResponseDto {
    exito: boolean;
    mensaje: string;
    ligaId: string; // Aseg�rate de que tu backend lo devuelva como string o Guid
    codigoUnico?: string; // Aunque no lo uses, si est� en el DTO C#, puedes incluirlo
}

export interface LigaPresupuestoDto {
    nombreLiga: string;
    presupuesto: number;
    // A�ade aqu� cualquier otra propiedad que tu DTO de C# tenga y que vayas a usar
}

export interface UserRankingDto {
    nombreUsuario: string;
    puntuacionTotal: number;
}

// Corresponde a 'DetallesLigaDTO' en C#
export interface LigaDetallesDto {
    ligaId: string; // GUIDs en C# son strings en TypeScript (Ej: "d293d6e0-1f9e-4e8c-8b8a-1a8c9e0d2b3f")
    nombreLiga: string;
    puntosActualesUsuario: number;
    clasificacionUsuarios: UserRankingDto[];
    jornadasDisponibles: number[]; // Array de n�meros de jornada
}

// Interfaces espec�ficas para AlineacionPage (si no las tienes ya)
export interface JugadorPorPosicionDTO {
    jugadorId: number;
    nombreJugador: string;
    posicion: string;
    nombreEquipo: string;
    esTitular: boolean;
}

export interface AlineacionDTO {
    plantillaId: string;
    titulares: number[];
    tipoAlineacion: string;
}

export interface JugadoresAgrupados {
    [key: string]: JugadorPorPosicionDTO[];
}