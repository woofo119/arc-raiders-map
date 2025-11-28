const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://woofo:da868133@cluster0.iienqyl.mongodb.net/arc-raiders-map?retryWrites=true&w=majority&appName=Cluster0', { serverSelectionTimeoutMS: 30000 })
    .then(async () => {
        console.log('Connected');
        const markerSchema = new mongoose.Schema({
            mapId: String,
            type: String,
            category: String,
            x: Number,
            y: Number,
            title: String,
            isOfficial: Boolean
        });
        const Marker = mongoose.model('Marker', markerSchema);

        const markers = await Marker.find({ category: 'extraction', mapId: 'dam' });
        console.log('Extraction Markers:', markers.map(m => ({ x: m.x, y: m.y, isOfficial: m.isOfficial })));

        await mongoose.disconnect();
    })
    .catch(err => console.error(err));
