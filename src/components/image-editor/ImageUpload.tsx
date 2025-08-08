import React from 'react';

interface ImageUploadProps {
  onImageUpload: (imageData: string) => void;
  uploadedImage: string | null;
  onEditImage: (mode: 'ai' | 'manual') => void;
  onReset: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  uploadedImage, 
  onEditImage, 
  onReset 
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!uploadedImage) {
    return (
      <div style={{
        border: '3px dashed #667eea',
        borderRadius: '15px',
        padding: '60px 20px',
        textAlign: 'center',
        background: '#f8f9ff',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '20px',
          color: '#667eea'
        }}>
          📸
        </div>
        <h3 style={{
          color: '#333',
          marginBottom: '15px',
          fontSize: '1.5rem'
        }}>
          Upload Your Image
        </h3>
        <p style={{
          color: '#666',
          marginBottom: '25px',
          fontSize: '1.1rem'
        }}>
          Drag and drop or click to select (JPEG, JPG, PNG)
        </p>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileChange}
          style={{
            display: 'none'
          }}
          id="imageUpload"
        />
        <label
          htmlFor="imageUpload"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '50px',
            cursor: 'pointer',
            border: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            display: 'inline-block',
            transition: 'transform 0.2s ease',
            boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)'
          }}
          onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
        >
          Choose Image
        </label>
      </div>
    );
  }

  return (
    <div style={{
      textAlign: 'center'
    }}>
      <div style={{
        marginBottom: '30px',
        position: 'relative',
        display: 'inline-block'
      }}>
        <img
          src={uploadedImage}
          alt="Uploaded"
          style={{
            maxWidth: '100%',
            maxHeight: '500px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            objectFit: 'contain'
          }}
        />
      </div>
      
      <div style={{
        marginBottom: '20px'
      }}>
        <h3 style={{
          color: '#333',
          marginBottom: '15px',
          fontSize: '1.3rem',
          fontWeight: 'bold'
        }}>
          Choose Your Editing Mode
        </h3>
        <p style={{
          color: '#666',
          fontSize: '1rem',
          marginBottom: '25px'
        }}>
          Select how you'd like to edit your image
        </p>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => onEditImage('ai')}
          style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
            padding: '20px 40px',
            borderRadius: '15px',
            border: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 5px 15px rgba(255, 107, 107, 0.4)',
            minWidth: '200px',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            const target = e.target as HTMLElement;
            target.style.transform = 'translateY(-3px)';
            target.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.6)';
          }}
          onMouseOut={(e) => {
            const target = e.target as HTMLElement;
            target.style.transform = 'translateY(0)';
            target.style.boxShadow = '0 5px 15px rgba(255, 107, 107, 0.4)';
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎨</div>
          <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Edit via Prompt</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            AI-powered smart editing
          </div>
        </button>
        
        <button
          onClick={() => onEditImage('manual')}
          style={{
            background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
            color: 'white',
            padding: '20px 40px',
            borderRadius: '15px',
            border: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 5px 15px rgba(0, 184, 148, 0.4)',
            minWidth: '200px',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            const target = e.target as HTMLElement;
            target.style.transform = 'translateY(-3px)';
            target.style.boxShadow = '0 8px 25px rgba(0, 184, 148, 0.6)';
          }}
          onMouseOut={(e) => {
            const target = e.target as HTMLElement;
            target.style.transform = 'translateY(0)';
            target.style.boxShadow = '0 5px 15px rgba(0, 184, 148, 0.4)';
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>✏️</div>
          <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Edit Manually</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Canvas-based text overlays
          </div>
        </button>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={onReset}
          style={{
            background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '50px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 5px 15px rgba(116, 185, 255, 0.4)'
          }}
          onMouseOver={(e) => {
            const target = e.target as HTMLElement;
            target.style.transform = 'translateY(-2px)';
            target.style.boxShadow = '0 8px 20px rgba(116, 185, 255, 0.6)';
          }}
          onMouseOut={(e) => {
            const target = e.target as HTMLElement;
            target.style.transform = 'translateY(0)';
            target.style.boxShadow = '0 5px 15px rgba(116, 185, 255, 0.4)';
          }}
        >
          🔄 Upload New Image
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;