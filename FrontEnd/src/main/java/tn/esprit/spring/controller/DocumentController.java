package tn.esprit.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.spring.service.IDocumentService;

import java.io.IOException;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:4200")
public class DocumentController {

    private final IDocumentService documentService;

    @Autowired
    public DocumentController(@Qualifier("documentService") IDocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadDocument(@RequestParam("file") MultipartFile file) {
        try {
            String filename = documentService.saveDocument(file);
            return ResponseEntity.ok(filename);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Could not upload file");
        }
    }

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable String filename) {
        try {
            Resource resource = documentService.loadDocument(filename);
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 