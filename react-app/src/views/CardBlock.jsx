import React, {useEffect, useState} from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './style.css'
import icon from '../assets/img.png';
import dollarIcon from '../assets/dollar-icon.png';
import rubleIcon from '../assets/ruble-icon.png';

function CardBlock() {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({});
    const [cards, setCards] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [isSelected, setIsSelected] = useState(false);
    const [dollarValue, setDollarValue] = useState('');
    const [rubleValue, setRubleValue] = useState('');

    useEffect(() => {
        fetchCards();
    }, []);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
    const handleCardSelect = (id) => {
        setShowAddCard(false);
        setSelectedCardId(id);
        setIsSelected(false);
    };

    const handleAddCardClick = () => {
        setShowAddCard(true);
        setSelectedCardId(null);
        setIsSelected(true);
    };
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (cardNumber.length !== 16) {
            newErrors.cardNumber = 'Номер карты должен состоять из 16 цифр';
            toast.error(newErrors.cardNumber);
            isValid = false;
        }

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        if (!expiryYear || expiryYear < currentYear) {
            newErrors.expiryYear = 'Год должен быть не меньше или равно текущему';
            toast.error(newErrors.expiryYear);
            isValid = false;
        }

        if ( parseInt(expiryYear, 10) === currentYear) {
            if (expiryMonth <= currentMonth) {
                newErrors.expiryMonth = 'Месяц должен быть хотя бы на один впереди текущего';
                toast.error(newErrors.expiryMonth);
                isValid = false;
            }
        }

        if (!expiryMonth || expiryMonth < 1 || expiryMonth > 12) {
            newErrors.expiryMonth = 'Месяц должен быть от 1 до 12';
            toast.error(newErrors.expiryMonth);
            isValid = false;
        }

        if (cvv.length !== 3) {
            newErrors.cvv = 'CVV должен состоять из 3 цифр';
            toast.error(newErrors.cvv);
            isValid = false;
        }

        const isDuplicate = cards.some(card => card.card_number === cardNumber);
        if (isDuplicate) {
            newErrors.cardNumber = 'Дубликат номера карты запрещен';
            toast.error(newErrors.cardNumber);
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const fetchCards = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/cards');
            setCards(response.data);
        } catch (error) {
            console.error('Failed to fetch cards:', error);
            toast.error('Ошибка при получении карт');
        }
    };

    function clearInputs() {
        setCardNumber('');
        setExpiryMonth('');
        setExpiryYear('');
        setCvv('');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedCardId === null && !isSelected) {
            toast.error("Пожалуйста, выберите способ оплаты.");
            return;
        }

        if (selectedCardId !== null && !isSelected) {
            toast.success('Оплата прошла успешно');
            return;
        }

        if (!validateForm()) return;

        if (isChecked) {
            try {
                const response = await axios.post('http://localhost:8000/api/cards', {
                    card_number: cardNumber,
                    expiry_month: expiryMonth,
                    expiry_year: expiryYear,
                    cvv: cvv
                });
                console.log('Card added:', response.data);
                setCards([...cards, response.data]);
                toast.success('Карта успешно добавлена');
                setTimeout(() => {
                    clearInputs();
                    console.log('Поля очищены');
                }, 1000);
            } catch (error) {
                console.error('Failed to add card:', error);
                toast.error('Ошибка при добавлении карты');
            }
        } else {
            toast.success('Оплата прошла успешно');
            setTimeout(() => {
                clearInputs();
                console.log('Поля очищены');
            }, 1000);
        }
    };

    const handleDollarChange = (e) => {
        const dollars = parseFloat(e.target.value);
        setDollarValue(dollars);
        setRubleValue((dollars * 15).toFixed(2));
    };

    const handleRubleChange = (e) => {
        const rubles = parseFloat(e.target.value);
        setRubleValue(rubles);
        setDollarValue((rubles / 15).toFixed(2));
    };
    return (
        <div className="payment-block">

            <form onSubmit={handleSubmit} className="payment-block-form">
                <label className="payment-block-form-title">Пополнить банковской картой</label>
                <label className="payment-block-exchange-title">УКАЖИТЕ СУММУ</label>

                <div className="payment-block-exchange">
                    <div className="payment-block-exchange-block">
                        <input
                            type="number"
                            placeholder="0000.00"
                            className="payment-block-exchange-block-input payment-block-exchange-block-left-input"
                            value={dollarValue}
                            onChange={handleDollarChange}
                        />
                        <img src={dollarIcon} alt="Dollar Icon" className="payment-block-exchange-block-icon"/>
                    </div>
                    <div className="payment-block-exchange-block">
                        <input
                            type="number"
                            placeholder="0000.00"
                            className="payment-block-exchange-block-input payment-block-exchange-block-right-input"
                            value={rubleValue}
                            onChange={handleRubleChange}
                        />
                        <img src={rubleIcon} alt="Ruble Icon" className="payment-block-exchange-block-icon"/>
                    </div>
                </div>


                <div className="payment-block-cards">
                    {cards.length > 0 && (
                        cards.map(card => (
                            <div className={`payment-block-cards-card ${selectedCardId === card.id ? 'payment-block-cards-card-selected-black' : ''}`} onClick={() => handleCardSelect(card.id)}>
                                <div className="payment-block-cards-card-number">**** {card.card_number.slice(-4)}</div>
                                <div className="payment-block-cards-card-date">{card.expiry_month} / {card.expiry_year}</div>
                            </div>
                        ))
                    )}
                    <div className={`payment-block-cards-add-card ${isSelected ? 'payment-block-cards-add-card-selected-blue' : ''}`} onClick={handleAddCardClick}>
                        <div className="payment-block-cards-add-title">+</div>
                        <div>Новая карта</div>
                    </div>
                </div>

                {showAddCard && (
                <div className="payment-block-new-card-block">
                    <div className="payment-block-new-card-block-card">
                        <label className="payment-block-new-card-block-card-title">Номер карты</label>
                        <input
                            type="number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Введите номер карты"
                            className={`payment-block-new-card-block-card-number-input ${errors.cardNumber ? 'error' : ''}`}
                        />

                        <label className="payment-block-new-card-block-card-title">Действует до</label>
                        <div className="payment-block-new-card-block-card-input-row">
                            <input
                                type="number"
                                min="1"
                                max="12"
                                value={expiryMonth}
                                onChange={(e) => setExpiryMonth(e.target.value)}
                                placeholder="ММ"
                                className={`payment-block-new-card-block-card-expire-date-input ${errors.expiryMonth ? 'error' : ''}`}
                            />

                            <label className="card-block-card-expire-date-label">/</label>
                            <input
                                type="number"
                                value={expiryYear}
                                onChange={(e) => setExpiryYear(e.target.value)}
                                placeholder="ГГ"
                                className={`payment-block-new-card-block-card-expire-date-input ${errors.expiryYear ? 'error' : ''}`}
                            />

                        </div>
                    </div>
                    <div className="payment-block-new-card-block-back-card">
                        <label className="payment-block-new-card-block-back-card-line"> </label>
                        <label className="payment-block-new-card-block-back-card-title">CVV/CVC</label>
                        <div className="payment-block-new-card-block-back-card-input-row">
                            <input
                                type="number"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                placeholder="000"
                                className={`payment-block-new-card-block-back-card-CVV-input ${errors.cvv ? 'error' : ''}`}

                            />

                        </div>
                        <label className="payment-block-new-card-block-back-card-CVV-title">три цифры
                            с обратной стороны карты</label>
                    </div>
                </div>
                )}
                {showAddCard && (
                <div>
                    <div className="payment-block-new-card-block-checkbox">
                        <input
                            type="checkbox"
                            id="analyzeCheckbox"
                            className="payment-block-new-card-block-checkbox-container"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="analyzeCheckbox" className="payment-block-new-card-block-checkbox-label">
                            Запомнить эту карту. Это безопасно.
                            <img src={icon} alt="Иконка" className="payment-block-new-card-block-checkbox-icon" />
                            <br />
                            Сохраняя карту, вы соглашаетесь с
                            <a href="#" className="payment-block-new-card-block-checkbox-link"> условиями привязки карты.</a>
                        </label>

                    </div>


                </div>
                )}

                <button className="blue-button">Оплатить</button>
                <ToastContainer />
            </form>
        </div>


    );
}

export default CardBlock;
