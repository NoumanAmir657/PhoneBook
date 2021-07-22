import React, { useState, useEffect } from 'react'
import Name from './Components/Name.js'
import Notification from './Components/Notification.js'
import connectionService from './services/connection'

//start
const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [showPersons, setShowPerson] = useState(persons)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    connectionService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setShowPerson(initialPersons)
      })
  }, [])

  const handleChangeName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleChangeNumber = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    console.log(event.target.value)
    setNewSearch(event.target.value)
    setShowPerson(persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  const submitAction = (event) => {
    event.preventDefault()
    let foundName = persons.find((person) => newName === person.name)
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (foundName === undefined){

      setNewName('')
      setNewNumber('')

      connectionService
      .create(personObject)
      .then(returnedPerson => {
        console.log(returnedPerson)
        setPersons(persons.concat(personObject))
        setShowPerson(persons.concat(personObject))
        setErrorMessage('New Person was added to the PhoneBook')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    }
    else{
      let flag = window.confirm(`${newName} is already in the Phonebook. Do you want to replace the old number with the new number?`)
      setNewName('')
      setNewNumber('')
      if (flag) {
        connectionService.update(foundName.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.name !== newName ? person : returnedPerson))
          setShowPerson(persons.map(person => person.name !== newName ? person : returnedPerson))
          setErrorMessage(`${newName} number was changed in the PhoneBook`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(
            `Person '${newName}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      }
    }
  }

  const deletePerson = (id) => {
    let flag
    for (let i = 0; i < persons.length; ++i){
      if (persons[i].id === id){
        flag = window.confirm(`Delete ${persons[i].name}?`)
        break
      }
    }
    
    if (flag){
      connectionService.del(id)
      setPersons(persons.filter((person) => person.id !== id))
      setShowPerson(showPersons.filter((person) => person.id !== id))
    }
  }


  return (
    <div className='body'>
      <h1>Phonebook</h1>
      <Notification message={errorMessage}/>
      <h3>Search By Name</h3>
      <div className='center'><input className='textField' value={newSearch} onChange={handleSearch}/></div>
      <h3>Add New</h3>
      <form onSubmit={submitAction}>
      <div className='container'>
        <div>
          Name <br></br> <input className='textField' value={newName} onChange={handleChangeName}/>
        </div>
        <div>
          Number <br></br> <input className='textField' value={newNumber} onChange={handleChangeNumber}/>
        </div>
        <div>
          <button className='button' type="submit">Add</button>
        </div>
      </div>
      </form>
      <h2>Numbers</h2>
      <div className='list'>
      <ul>
      {showPersons.map((person,i) =>
        <Name key={i} person={person} deletePerson={() => deletePerson(person.id)}/>)}
      </ul>
      </div>
    </div>
  )
}
export default App
