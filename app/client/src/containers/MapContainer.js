import React, { useState } from 'react'
import { Map as LeafletMap, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import './MapContainer.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default function Map(props) {

    function getZoom() {
        let zoom;
        if (props.mapCenter.city !== 'Suomi') {
            zoom = 11
        } else {
            zoom = 6
        }

        if (window.innerWidth <= 600) {
            return zoom-1
        }
        return zoom
    }

    return (
        <div className='map-container'>
            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css" />
            <LeafletMap
                center={[props.mapCenter.lat, props.mapCenter.lon]}
                zoom={getZoom()}
                attributionControl={true}
                zoomControl={false}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
            >
                <TileLayer
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                {props.locations.map(location =>
                <Marker
                    key={location._id}
                    position={[location.lat,location.lon]}
                    opacity={0.9}
                    onclick={() => props.handleLocationPopup(location)}
                >
                    <Popup>
                        {' '}
                    </Popup>
                </Marker>
                )}
                <ZoomControl position='bottomright' />
            </LeafletMap>
        </div>
    )
}