const Contact = require("../models/contact.model");

const getAllContacts = async (req, res) => {
    try {
        const { municipality, category, query } = req.query;
        let dbQuery = {};

        if (municipality) dbQuery.municipality = municipality;
        if (category) dbQuery.category = category;
        if (query) {
            dbQuery.name = { $regex: query, $options: "i" };
        }

        const contacts = await Contact.find(dbQuery).sort({ category: 1, name: 1 });
        return res.status(200).json({
            success: true,
            contacts,
        });
    } catch (error) {
        console.error("Fetch Contacts Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const seedContacts = async (req, res) => {
    try {
        const sampleContacts = [
            { name: "Central Police Station", category: "Police", phone: "011-23381234", municipality: "Central Metro", address: "Main Road, Block A", pinCode: "110001" },
            { name: "City General Hospital", category: "Hospital", phone: "011-26514444", municipality: "Central Metro", address: "Health Enclave", pinCode: "110016" },
            { name: "Northwood Emergency Services", category: "Emergency", phone: "102", municipality: "Northwood District", address: "Emergency Hub", pinCode: "110025" },
            { name: "Southview Municipal Office", category: "Municipality", phone: "011-29561234", municipality: "Southview City", address: "Civic Center", pinCode: "110070" },
            { name: "Eastside Fire Station", category: "Fire Station", phone: "101", municipality: "Eastside Ward", address: "Fire Gate 1", pinCode: "110092" },
            { name: "Westend Metro Hospital", category: "Hospital", phone: "011-45678900", municipality: "Westend Zone", address: "Sector 10", pinCode: "110075" }
        ];

        await Contact.deleteMany({}); // Clear existing
        await Contact.insertMany(sampleContacts);

        return res.status(201).json({ message: "Sample contacts seeded successfully" });
    } catch (error) {
        console.error("Seed Contacts Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const createContact = async (req, res) => {
    try {
        const { name, category, phone, address, pinCode } = req.body;
        const municipality = req.admin.organisation; // Lock to admin's org

        const newContact = await Contact.create({
            name,
            category,
            phone,
            address,
            pinCode,
            municipality
        });

        return res.status(201).json({
            success: true,
            message: "Contact added successfully",
            contact: newContact
        });
    } catch (error) {
        console.error("Create Contact Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, phone, address, pinCode } = req.body;
        
        const contact = await Contact.findOne({ _id: id, municipality: req.admin.organisation });
        if (!contact) {
            return res.status(404).json({ message: "Contact not found or unauthorized" });
        }

        contact.name = name || contact.name;
        contact.category = category || contact.category;
        contact.phone = phone || contact.phone;
        contact.address = address || contact.address;
        contact.pinCode = pinCode || contact.pinCode;

        await contact.save();

        return res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            contact
        });
    } catch (error) {
        console.error("Update Contact Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        
        const contact = await Contact.findOneAndDelete({ _id: id, municipality: req.admin.organisation });
        if (!contact) {
            return res.status(404).json({ message: "Contact not found or unauthorized" });
        }

        return res.status(200).json({
            success: true,
            message: "Contact deleted successfully"
        });
    } catch (error) {
        console.error("Delete Contact Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getAllContacts, seedContacts, createContact, updateContact, deleteContact };
