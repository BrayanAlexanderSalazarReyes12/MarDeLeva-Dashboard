import { useEffect, useState } from 'react';
import { db } from '../../db/FireBaseConf';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'tailwindcss/tailwind.css';


// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Mq_7_graf = () => {
    const [alertas, setAlertas] = useState([]);
    const [llamaValue, setLlamaValue] = useState(null);
    const [mq_7, setMq_7] = useState(null);

    useEffect(() => {
        const alertaicendiosCollection = collection(db, 'marleva');
        const orderedQuery = query(alertaicendiosCollection, orderBy('id', 'asc'));

        const unsubscribe = onSnapshot(orderedQuery, (snapshot) => {
        const alertamareaalta = snapshot.docs.map((doc) => ({
            id: doc.id,
            sensoragua: doc.data().sensoragua,
            sensorprecion: doc.data().sensorprecion
        }));

        setAlertas(alertamareaalta);

        if (alertamareaalta.length > 0) {
            const lastItemIndex = alertamareaalta.length - 1;
            setLlamaValue(alertamareaalta[lastItemIndex].sensoragua);
            setMq_7(alertamareaalta[lastItemIndex].sensorprecion);
        } else {
            setLlamaValue(0);
            setMq_7(0);
        }
        });

        return () => unsubscribe();
    }, []);

    // Preparar datos para la gráfica
    const data = {
        labels: alertas.map((alerta, index) => `sensorprecion ${index + 1}`),
        datasets: [
            {
                label: 'Sensor de presion',
                data: alertas.map(alerta => alerta.sensorprecion),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <div className="w-full h-full">
            <Line data={data} options={options} />
        </div>
    )
}

export default Mq_7_graf