import React from "react";
import './Card.css';

const Card = ({nama, tanggal, deskripsi}) =>{
    return(
        <div className="card">
            <div className="card-content">
                <h2>{nama}</h2>
                <p>{tanggal}</p>
                <p>{deskripsi}</p>
            </div>
            <div>
                <button className="btn-edit">Edit</button>
                <button className="btn-delete">Delete</button>
            </div>
        </div>
    )
}

export default Card;