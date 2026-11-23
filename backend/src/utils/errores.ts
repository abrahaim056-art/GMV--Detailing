// Error con código HTTP. Se lanza dentro de un controlador (throw new ErrorHttp(404, "...")),
// el bloque catch lo manda con next(error) y manejadorErrores lo convierte en respuesta.
export class ErrorHttp extends Error {
  codigo: number;

  constructor(codigo: number, mensaje: string) {
    super(mensaje);
    this.name = "ErrorHttp";
    this.codigo = codigo;
  }
}
