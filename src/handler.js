const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
	const { title, tags, body } = request.payload;

	const id = nanoid(16);
	const createdAt = new Date().toISOString();
	const updatedAt = createdAt;

	const newNote = {
		title,
		tags,
		body,
		id,
		createdAt,
		updatedAt,
	};

	notes.push(newNote);

	const isSuccess = notes.find((note) => note.id === newNote.id);

	if (isSuccess) {
		console.log("success");
		const response = h.response({
			status: "success",
			message: "Catatan berhasil ditambahkan",
			data: {
				noteId: id,
			},
		});
		response.code(201);
		return response;
	} else {
		const response = h.response({
			status: "fail",
			message: "Catatan gagal ditambahkan",
		});
		response.code(500);
		return response;
	}
};

const getAllNotesHandler = () => ({
	status: "success",
	data: {
		notes,
	},
});

const getNotedByIdHandler = (request, h) => {
	const { id } = request.params;
	const note = notes.filter((note) => note.id === id)[0];
	console.log(note);
	if (note !== undefined) {
		return {
			status: "success",
			data: {
				note,
			},
		};
	} else {
		const response = h
			.response({
				status: "fail",
				message: "catatan tidak ditemukan",
			})
			.code(404);
		return response;
	}
};

const editNoteByIdHandler = (request, h) => {
	const { id } = request.params;

	const { title, tags, body } = request.payload;
	const updatedAt = new Date().toISOString();

	const index = notes.findIndex((note) => note.id === id);
	console.log(index);
	if (index === 0) {
		notes[index] = {
			...notes[index],
			title,
			tags,
			body,
			updatedAt,
		};

		const response = h
			.response({
				status: "success",
				message: "Catatan berhasil diperbarui",
			})
			.code(200);

		console.log(notes);
		return response;
	}

	const response = h
		.response({
			status: "fail",
			message: "Gagal memperbarui catatan. Id tidak ditemukan",
		})
		.code(404);
	return response;
};

const deleteNoteByIdHandler = (request, h) => {
	const { id } = request.params;

	const index = notes.findIndex((note) => note.id === id);

	if (index !== -1) {
		notes.splice(index, 1);
		const response = h
			.response({
				status: "success",
				message: "Catatan berhasil dihapus",
			})
			.code(200);
		return response;
	}
}


module.exports = { addNoteHandler, getAllNotesHandler, getNotedByIdHandler, editNoteByIdHandler , deleteNoteByIdHandler};
