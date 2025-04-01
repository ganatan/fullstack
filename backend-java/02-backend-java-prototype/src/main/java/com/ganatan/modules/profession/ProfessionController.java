package com.ganatan.modules.profession;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ganatan.config.AppConfig;

@WebServlet("/professions/*")
public class ProfessionController extends HttpServlet {

    private final ProfessionService service;
    private final ObjectMapper mapper = new ObjectMapper();

    public ProfessionController() {
        ProfessionRepository repository = new ProfessionRepository(AppConfig.useDatabase());
        this.service = new ProfessionService(repository);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (pathInfo == null || pathInfo.equals("/")) {
            List<Profession> items = service.getItems();
            mapper.writeValue(response.getWriter(), items);
        } else {
            try {
                int id = extractId(pathInfo);
                Optional<Profession> item = service.getItemById(id);
                if (item.isPresent()) {
                    mapper.writeValue(response.getWriter(), item.get());
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    writeError(response, "Item not found");
                }
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                writeError(response, "Invalid ID");
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Profession profession = mapper.readValue(request.getReader(), Profession.class);
        Profession created = service.createItem(profession);

        response.setStatus(HttpServletResponse.SC_CREATED);
        response.setContentType("application/json");
        mapper.writeValue(response.getWriter(), created);
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        try {
            int id = extractId(pathInfo);
            Profession updatedData = mapper.readValue(request.getReader(), Profession.class);
            Optional<Profession> updated = service.updateItem(id, updatedData);

            if (updated.isPresent()) {
                response.setContentType("application/json");
                mapper.writeValue(response.getWriter(), updated.get());
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                writeError(response, "Item not found");
            }
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeError(response, "Invalid ID");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        try {
            int id = extractId(pathInfo);
            boolean deleted = service.deleteItem(id);

            if (deleted) {
                response.setStatus(HttpServletResponse.SC_OK);
                mapper.writeValue(response.getWriter(), mapper.createObjectNode().put("message", "Deleted successfully"));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                writeError(response, "Item not found");
            }
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeError(response, "Invalid ID");
        }
    }

    private int extractId(String pathInfo) {
        String[] parts = pathInfo.split("/");
        return Integer.parseInt(parts[1]);
    }

    private void writeError(HttpServletResponse response, String message) throws IOException {
        ObjectNode error = mapper.createObjectNode();
        error.put("error", message);
        mapper.writeValue(response.getWriter(), error);
    }
}
