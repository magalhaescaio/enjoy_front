
import { useEffect, useState } from 'react'

import { Redirect } from 'react-router-dom'

export default function(props){
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        
        localStorage.removeItem('OnlyOne-Token')
        window.location.href = '/login'

    }, [])

    return(
        <>
        
            {redirect
                ? <Redirect />
                : <></>
            }
        </>
    )
}