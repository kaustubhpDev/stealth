import React from 'react'
import img from "../img/img.jpg"

const CarouselCard = ({ item }) => {

    return (
        <div className='carousel' >
            <div className='carousel_div'>
                <section className='per_info'>
                    <section className='per_info_img'>
                        <img src={img} alt="loading" />

                    </section>
                    <section className='info' >
                        <p>onkar kotule,</p>
                        <p>full stack developer, Google</p>
                    </section>
                </section>
                <section className='description'>

                    {/* <p>{item.name}</p> */}
                    <div>{item.description} {item.description}</div>
                </section>


            </div>
        </div>
    )
}

export default CarouselCard