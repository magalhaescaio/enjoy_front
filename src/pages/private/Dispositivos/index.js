import { useEffect, useState } from 'react';
import { FiHardDrive } from 'react-icons/fi'

export default function (props) {

    const [loading, setLoading] = useState()
    const [user, setUser] = useState()

    const devices = [
        {
            name: "Torre A",
            mac_address: "B4:E6:2D:0B:EE:FE",
            type: "tower",
            created_at: "10/08/2022 17:39:25",
            ambient: "Seletividade"
        },
        {
            name: "Torre B",
            mac_address: "B4:E6:2D:0B:F1:A9",
            type: "tower",
            created_at: "10/08/2022 17:39:25",
            ambient: "Seletividade"
        },
        {
            name: "Torre C",
            mac_address: "DC:4F:22:21:AF:F6",
            type: "tower",
            created_at: "10/08/2022 17:39:25",
            ambient: "Seletividade"
        },
        {
            name: "Torre D",
            mac_address: "B4:E6:2D:0B:ED:F0",
            type: "tower",
            created_at: "10/08/2022 17:39:25",
            ambient: "Seletividade"
        },

        {
            name: "Piscinas",
            mac_address: "B4:E6:2D:0B:A2:08",
            type: "pool",
            created_at: "10/08/2022 17:39:25",
            ambient: "Seletividade"
        },
    ]

    useEffect(() => {
        var data = JSON.parse(localStorage.getItem('OnlyOne-userData'))
        setUser(data)
    }, []);
    return (
        <>
            <div className="page-title-container">
                <h1 className="mb-0 pb-0 display-4 mt-2">
                    <FiHardDrive style={{ marginTop: '-7px' }} /> &nbsp;
                    Dispositivos
                </h1>
            </div>



            <div className='card'>
                <div className='card-body'>

                    <div className="alert alert-light" role="alert">
                        <h4 className="alert-heading">Importante!</h4>
                        <p>
                            Para o funcionamento completo do ambiente de seletividade não será possível editar ou excluir os módulos. <br /> 
                        </p>

                        <p className="mb-0">Em caso de dúvidas entre em contato com o administrador do sistema.</p>
                    </div>

                    <div className="row g-0 h-100 align-content-center mb-2  d-none d-sm-flex">
                        <div className="col-2 d-flex align-items-center">
                            <div className="text-muted text-medium cursor-pointer" data-sort="name">Nome</div>
                        </div>
                        <div className="col-2 d-flex align-items-center">
                            <div className="text-muted text-medium cursor-pointer" data-sort="category">Mac</div>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-center">
                            <div className="text-muted text-medium cursor-pointer" data-sort="sale">Tipo</div>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-center">
                            <div className="text-muted text-medium cursor-pointer" data-sort="sale">Ambiente</div>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-center">
                            <div className="text-muted text-medium cursor-pointer" data-sort="sale">Data</div>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-center">
                            <div className="text-muted text-medium cursor-pointer" data-sort="sale"></div>
                        </div>
                    </div>

                    {devices.map((row, index) => {
                        return (
                            <div className='row g-0 h-100 align-content-center mb-2  d-none d-sm-flex' key={index}>
                                <div className='col-2 d-flex align-items-left justify-content-left'>
                                    <div className="text-black text-small cursor-pointer" data-sort="sale">{row.name}</div>
                                </div>

                                <div className='col-2 d-flex align-items-left justify-content-left'>
                                    <div className="text-black text-small cursor-pointer" data-sort="sale">{row.mac_address}</div>
                                </div>
                                <div className='col-2 d-flex align-items-center justify-content-center'>
                                    <div className="text-black text-small cursor-pointer" data-sort="sale">{row.type}</div>
                                </div>
                                <div className='col-2 d-flex align-items-center justify-content-center'>
                                    <div className="text-black text-small cursor-pointer" data-sort="sale">{row.ambient}</div>
                                </div>
                                <div className='col-2 d-flex align-items-center justify-content-center'>
                                    <div className="text-black text-small cursor-pointer" data-sort="sale">{row.created_at}</div>
                                </div>

                                <div className='col-2 d-flex align-items-center justify-content-center'>

                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </>
    )
}