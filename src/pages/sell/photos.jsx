import { useEffect, useRef, useState } from 'react'

const MAX_PHOTOS = 5

function PhonePhotos({ photos, onPhotosChange, onNext, onBack }) {
  const [error, setError] = useState('')
  const previewUrls = useRef(new Set())

  useEffect(() => {
    const urls = previewUrls.current

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  function handleFilesChange(event) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''

    const imageFiles = files.filter((file) => file.type.startsWith('image/'))
    const remainingSlots = MAX_PHOTOS - photos.length
    const filesToAdd = imageFiles.slice(0, remainingSlots)

    const photosToAdd = filesToAdd.map((file) => {
      const url = URL.createObjectURL(file)
      previewUrls.current.add(url)
      return { file, url }
    })

    onPhotosChange([...photos, ...photosToAdd])

    if (imageFiles.length !== files.length) {
      setError('Please select image files only.')
    } else if (files.length > remainingSlots) {
      setError(`You can add up to ${MAX_PHOTOS} photos.`)
    } else {
      setError('')
    }
  }

  function removePhoto(photoToRemove) {
    URL.revokeObjectURL(photoToRemove.url)
    previewUrls.current.delete(photoToRemove.url)
    onPhotosChange(photos.filter((photo) => photo !== photoToRemove))
    setError('')
  }

  return (
    <section className="sell-brand-step">
      <div className="sell-section-heading">
        <h2>Add photos of your phone</h2>
        <p>
          Clear photos from the front, back, and sides help show your phone’s condition.
          Add up to {MAX_PHOTOS} images.
        </p>
      </div>

      <div className="sell-photo-upload-area">
        <label className="sell-photo-upload">
          <span className="sell-photo-upload-icon" aria-hidden="true">+</span>
          <span>Add photos</span>
          <span className="sell-photo-upload-hint">JPG, PNG, or other image formats</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            aria-label="Add phone photos"
          />
        </label>

        {photos.length > 0 && (
          <div className="sell-photo-grid">
            {photos.map(({ file, url }, index) => (
              <figure className="sell-photo-preview" key={`${file.name}-${file.size}-${index}`}>
                <img src={url} alt={`Phone photo ${index + 1}`} />
                <figcaption>
                  <span title={file.name}>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removePhoto(photos[index])}
                    aria-label={`Remove ${file.name}`}
                  >
                    Remove
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <p className="sell-photo-count">{photos.length} of {MAX_PHOTOS} photos added</p>
        {error && <p className="sell-photo-error" role="alert">{error}</p>}
      </div>

      <div className="sell-step-footer">
        <button className="sell-back-button" type="button" onClick={onBack}>
          Back
        </button>
        <p>{photos.length ? `${photos.length} photo${photos.length === 1 ? '' : 's'} added` : 'Add at least one photo to continue'}</p>
        <button
          className="sell-next-button"
          type="button"
          onClick={onNext}
          disabled={!photos.length}
        >
          Continue
        </button>
      </div>
    </section>
  )
}

export default PhonePhotos