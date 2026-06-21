import { Request, Response, NextFunction } from "express";
import { EmployerNoteService } from "./employer.note.service";
import { addNoteSchema, updateNoteSchema } from "./employer.note.request";

export class EmployerNoteController {
  constructor(private readonly noteService: EmployerNoteService) {}

  getNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params; // applicationId
      const notes = await this.noteService.getNotes(userId, id as string);

      res.status(200).json({
        status: "success",
        data: notes,
      });
    } catch (error) {
      next(error);
    }
  };

  addNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const data = addNoteSchema.parse(req.body);
      const newNote = await this.noteService.addNote(userId, data);

      res.status(201).json({
        status: "success",
        message: "Thêm ghi chú thành công",
        data: newNote,
      });
    } catch (error) {
      next(error);
    }
  };

  updateNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { noteId } = req.params;
      const data = updateNoteSchema.parse(req.body);
      
      const updatedNote = await this.noteService.updateNote(userId, parseInt(noteId as string), data);

      res.status(200).json({
        status: "success",
        message: "Cập nhật ghi chú thành công",
        data: updatedNote,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { noteId } = req.params;
      
      await this.noteService.deleteNote(userId, parseInt(noteId as string));

      res.status(200).json({
        status: "success",
        message: "Xóa ghi chú thành công",
      });
    } catch (error) {
      next(error);
    }
  };
}
