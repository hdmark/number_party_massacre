import { useState } from 'react'
import { collection, } from 'firebase/firestore'


import { query, orderBy } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
// import { sample_data } from "../sample_data"


function AddTask({ onClose, open }) {

  console.log("ADD TASK");
  // easily access the Firestore library
  const firestore = useFirestore();
  const animalsCollection = collection(firestore, 'sample');
  const [isAscending] = useState(false);
  const animalsQuery = query(animalsCollection, orderBy('commonName', isAscending ? 'asc' : 'desc'));
  const { status, data: animals } = useFirestoreCollectionData(animalsQuery, {
    idField: 'id',
  });

  console.log(animals);

  // easily check the loading status
  if (status === 'loading') {
    return <p>Fetching burrito flavor...</p>;
  }

  /* function to add new task to firestore */
  // const handleSubmit = async (e) => {
  //   // e.preventDefault()
  //   // try {
  //   //   for (let data of sample_data) {
  //   //     await addDoc(collection(db, 'sample'), {
  //   //       ...data,
  //   //       created: Timestamp.now()
  //   //     })
  //   //   }

  //   // } catch (err) {
  //   //   alert(err)
  //   // }
  // }

  return (
    <div >
      <ul>
        {animals.map((animal) => (
          <li key={animal.id}>{animal.TITLE}</li>
        ))}
      </ul>
      {/* <form onSubmit={handleSubmit} className='addTask' name='addTask'>
        <input
          type='text'
          name='title'
          onChange={(e) => setTitle(e.target.value.toUpperCase())}
          value={title}
          placeholder='Enter title' />
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Enter task decription'
          value={description}></textarea>
        <button type='submit'>Done</button>
      </form> */}
    </div>
  )
}

export default AddTask