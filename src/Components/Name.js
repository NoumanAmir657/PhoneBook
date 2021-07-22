import React from 'react'

const Note = ({person, deletePerson}) => {
  return (
    <li className='center'>{person.name} {person.number} <button onClick={deletePerson}>Delete</button></li>
  )
}

export default Note