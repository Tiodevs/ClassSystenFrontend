import { NextRequest, NextResponse } from "next/server";
import { getCookiesServer } from "./lib/cookieServer";
import { api } from "./app/services/api";

export async function middleware(req:NextRequest) {
    // Pega o caminho da pagina
    const {pathname} = req.nextUrl

    //  A documentação pede isso...
    if(pathname.startsWith("/_next") || pathname === "/"){
        return NextResponse.next()
    }

    //  Pega o token JWT nos cookies
    const token = getCookiesServer()

    const myUser = await api.get("/me", {
        headers:{
            Authorization: `Bearer ${token}`
        }
    })

    const listUsers = await api.get("/users",{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const resListUsers = listUsers.data

    const resMyUser = myUser.data

    const usersActive = resListUsers.filter((item:any) => item.active === true)

    const validetionUserActive = usersActive.filter((item:any) => item.id === resMyUser.id)

    const usersADM = resListUsers.filter((item:any) => item.adm === true)

    if(pathname.startsWith("/course") || pathname.startsWith("/events")){

        // Se não tiver um JWT ele manda para pagina de login
        if(!token){
            return NextResponse.redirect(new URL("/", req.url))
        }

        // NÃO ESTA FUNCINANDO DIREITO, Se não encontrar o usuario ativo ele retorna
        if(!validetionUserActive){
            return NextResponse.redirect(new URL("/", req.url))
        }

        // Faz a verificação para ver se o token é valido
        const isValid = await validateToken(token)

        // Se não for valido ele manda para a tela de login
        if(!isValid){
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    if(pathname.startsWith("/adm")){

        // Se não tiver um JWT ele manda para pagina de login
        if(!token){
            return NextResponse.redirect(new URL("/", req.url))
        }

        if(usersADM[0].id !== resMyUser.id){
            return NextResponse.redirect(new URL("/", req.url))
        }

        // Faz a verificação para ver se o token é valido
        const isValid = await validateToken(token)

        // Se não for valido ele manda para a tela de login
        if(!isValid){
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    return NextResponse.next()
}

async function validateToken(token:string) {
    if(!token) return false


    try {
        await api.get("/me", {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        return true
    } catch (err) {
        console.log("Erro do tolken: ",err)
        return false
    }
}