
import { useEffect } from 'react'
import Container from './container'
import Header from './header'
import Footer from './footer'

export default function (props) {

    useEffect(() => {

        // document.querySelector("html").setAttribute('data-placement', 'vertical')
        console.log()

    }, [])

    return (
        <>

            <Header {...props} />

            <Container {...props}/>

            <Footer {...props}/>

        </>
    )
}