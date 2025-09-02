"use client"

import * as React from "react"
import { Upload, X, ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void
  maxFiles?: number
  accept?: string
  className?: string
}

export function FileUpload({ onFilesChange, maxFiles = 5, accept = "image/*,video/*", className }: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const [dragActive, setDragActive] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return

    const fileArray = Array.from(newFiles)
    const validFiles = fileArray.slice(0, maxFiles - files.length)
    const updatedFiles = [...files, ...validFiles]

    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4" />
    } else if (file.type.startsWith("video/")) {
      return <Video className="w-4 h-4" />
    }
    return <Upload className="w-4 h-4" />
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          files.length >= maxFiles && "opacity-50 pointer-events-none",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop files here, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-primary hover:underline font-medium"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-muted-foreground">
          {files.length}/{maxFiles} files • Images and videos only
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Files:</p>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                {getFileIcon(file)}
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
