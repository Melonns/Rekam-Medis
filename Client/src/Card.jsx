import React from "react";
import './Card.css';

const Card = ({id,nama, tanggal, deskripsi,onEdit,onDelete}) =>{
    return(
        <div className="flex justify-between items-center border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="card-content">
                <h2 className="text-2xl">{nama}</h2>
                <p>{tanggal}</p>
                <p>{deskripsi}</p>
            </div>
            <div>
                <button className="bg-[#3B82F6] border-solid border-2 border-gray-300 rounded-md p-2 mr-4 btn-edit" onClick={() => onEdit(id)}>Edit</button>
                <button className="bg-[#EF4444] border-solid border-2 border-gray-300 rounded-md p-2 mb-4 btn-delete" onClick={() => onDelete(id)}>Delete</button>
            </div>
        </div>
    )
}

export default Card;