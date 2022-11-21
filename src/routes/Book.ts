import express from 'express'
import bookRoutes from '../controllers/Book'
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema'

const router = express.Router()

router.post('/create', ValidateSchema(Schemas.book.create), bookRoutes.createBook)
router.get('/get/:bookId', bookRoutes.readBook)
router.get('/get', bookRoutes.readBooks)
router.patch('/update/:bookId', ValidateSchema(Schemas.book.update), bookRoutes.updateBook)
router.delete('/delete/:bookId', bookRoutes.deleteBook)

export = router

