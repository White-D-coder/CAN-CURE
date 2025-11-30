import express from 'express';
import { credoc, getD, getDocId, updateDoc, delDoc } from '../controllers/doctor.controller.js';

const router = express.Router();

router.post('/', credoc);
router.get('/', getD);
router.get('/:id', getDocId);
router.put('/:id', updateDoc);
router.delete('/:id', delDoc);

export default router;
