import bcrypt from "bcryptjs";

// Convierte la contraseña en un texto cifrado que no se puede revertir.
export async function cifrar(contrasena: string): Promise<string> {
  return bcrypt.hash(contrasena, 10);
}

// Revisa si una contraseña coincide con la cifrada que está guardada.
export async function comparar(contrasena: string, contrasenaCifrada: string): Promise<boolean> {
  return bcrypt.compare(contrasena, contrasenaCifrada);
}
