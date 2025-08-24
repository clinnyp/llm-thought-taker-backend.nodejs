import app from '../../../index'
import { db } from '../../../shared/db/db'


test('POST /notes', async () => {
  const mockUser = { id: 'user_123', externalId: 'some_external_id' };
  const mockNote = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Note',
    content: 'This is a test note',
    created_at: '2024-08-24T12:34:56.789Z',
    modified_at: '2024-08-24T12:34:56.789Z',
    userId: 'user_123',
    prompt: 'Test prompt'
  };

  db.select = jest.fn().mockReturnValue({
    from: () => ({
      where: () => ({
        then: (cb) => cb([mockUser])
      })
    })
  });

  db.insert = jest.fn().mockReturnValue({
    values: () => ({
      returning: () => Promise.resolve([mockNote])
    })
  });

  const res = await app.request('/notes', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Test Note',
      content: 'This is a test note',
      external_user_id: 'some_external_id',
      prompt: 'Test prompt'
    })
  });

  expect(res.status).toBe(201);
  expect(await res.json()).toEqual({
    message: 'Note Created Successfully',
    note: [mockNote]
  });
});

afterEach(() => {
  jest.clearAllMocks()
})