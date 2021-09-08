import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { searchPostalCode } from '../../api';
import { Grid } from '../../components';
import './Representatives.scss';

export const Representatives = () => {
    const { postalCode } = useParams();
    const [representatives, setRepresentatives] = useState([]);
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');

    const adjustedPostalCode = useCallback(() => postalCode.toUpperCase(), [postalCode]);

    useEffect(() => {
        const results = searchPostalCode(adjustedPostalCode());
        results.then((({representatives, province, city}) => {
            setRepresentatives(representatives);
            setCity(city);
            setProvince(province);
        }));
    }, [adjustedPostalCode]);

    return (
        <section className="Representatives">
            <h2>{adjustedPostalCode()} - {city}, {province}</h2>
            <Grid
                data={representatives}
                columns={[
                    { name: 'Name', dataKey: "name" },
                    { name: 'Title', dataKey: "elected_office" },
                    { name: 'District', dataKey: "district_name" },
                    { name: 'Email', dataKey: "email", flexWeight: 2, renderer: (d) => (
                        <a href={`mailto:${d}`}>{d}</a>
                    ) },
                    { name: 'Phone', dataKey: "offices", sortable: false, renderer: (d) => {
                        const tel = d[0]?.tel;
                        return (<a href={`tel:${tel}`}>{tel}</a>);
                     } },
                    { name: 'Website', dataKey: "personal_url", sortable: false, renderer: (d) => (
                        d ? <a href={d} target="_blank" rel="noreferrer">Website</a> : ''
                    ) },
                ]}
            />
        </section>
    );
};