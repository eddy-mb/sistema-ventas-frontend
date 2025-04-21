import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Handler para obtener logs de auditoría
 * Esta es una API de solo lectura que funciona como proxy para el backend
 */
export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación usando el helper auth de NextAuth
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener parámetros de consulta
    const searchParams = req.nextUrl.searchParams;
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Preparar URL del backend
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/auditoria`;
    const url = new URL(apiUrl);
    
    // Añadir parámetros de consulta
    Object.keys(queryParams).forEach(key => {
      url.searchParams.append(key, queryParams[key]);
    });

    // Realizar consulta al backend
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.token}`
      }
    });

    // Devolver respuesta desde el backend
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Error al obtener logs de auditoría' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en API de auditoría:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// No se implementan métodos POST, PUT o DELETE ya que la auditoría
// debe ser responsabilidad exclusiva del backend