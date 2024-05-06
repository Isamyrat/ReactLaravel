import React, { useState } from 'react';
import axios from 'axios';

function CardBlock() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (cardNumber.length !== 16) newErrors.cardNumber = 'Номер карты должен состоять из 16 цифр';
    if (new Date(expiryDate) <= new Date()) newErrors.expiryDate = 'Дата окончания действия должна быть в будущем';
    if (cvv.length !== 3) newErrors.cvv = 'CVV должен состоять из 3 цифр';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
    /*  const response = await axios.get('http://localhost:8000/cards', );
      console.log('Card get:', response.data);*/

      axios.get('http://localhost:8000/api/cards')
        .then(response => {
          console.log('Card get:', response.data);
        })
        .catch(error => {
          if (!error.response) {
            // network error
            console.error('Network Error:', error);
          } else {
            // http status code
            const code = error.response.status;
            // response data
            const response = error.response.data;
            console.error('Error Code:', code);
            console.error('Error Response:', response);
          }
        });
    } catch (error) {
      console.error('Failed to get card:', error);
    }
    try {
      const response = await axios.post('http://localhost:8000/api/cards', { cardNumber, expiryDate, cvv });
      console.log('Card added:', response.data);
    } catch (error) {
      console.error('Failed to add card:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="Номер карты"
          style={{ borderColor: errors.cardNumber ? 'red' : '' }}
        />
        {errors.cardNumber && <div style={{ color: 'red' }}>{errors.cardNumber}</div>}

        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          placeholder="Дата окончания действия"
          style={{ borderColor: errors.expiryDate ? 'red' : '' }}
        />
        {errors.expiryDate && <div style={{ color: 'red' }}>{errors.expiryDate}</div>}

        <input
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="CVV"
          style={{ borderColor: errors.cvv ? 'red' : '' }}
        />
        {errors.cvv && <div style={{ color: 'red' }}>{errors.cvv}</div>}

        <button type="submit">Добавить карту</button>
      </form>
    </div>
  );
}

export default CardBlock;
