import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage user website projects - create, list, update, delete
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with project data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('pathParams', {})
            project_id = params.get('id')
            
            if project_id:
                cur.execute(
                    "SELECT id, name, preview_url, published, published_url, file_name, file_size, created_at, updated_at FROM projects WHERE id = %s",
                    (project_id,)
                )
                project = cur.fetchone()
                
                if not project:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Project not found'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(project), default=str)
                }
            else:
                cur.execute(
                    "SELECT id, name, preview_url, published, published_url, file_name, file_size, created_at, updated_at FROM projects ORDER BY created_at DESC"
                )
                projects = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(p) for p in projects], default=str)
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            name = body_data.get('name', 'Новый проект')
            preview_url = body_data.get('preview_url', '/placeholder.svg')
            file_content = body_data.get('file_content', '')
            file_name = body_data.get('file_name', '')
            file_size = body_data.get('file_size', 0)
            
            cur.execute(
                "INSERT INTO projects (name, preview_url, file_content, file_name, file_size) VALUES (%s, %s, %s, %s, %s) RETURNING id, name, preview_url, published, published_url, file_name, file_size, created_at",
                (name, preview_url, file_content, file_name, file_size)
            )
            new_project = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_project), default=str)
            }
        
        elif method == 'PUT':
            params = event.get('pathParams', {})
            project_id = params.get('id')
            body_data = json.loads(event.get('body', '{}'))
            
            published = body_data.get('published')
            published_url = body_data.get('published_url')
            name = body_data.get('name')
            
            update_fields = []
            update_values = []
            
            if name is not None:
                update_fields.append('name = %s')
                update_values.append(name)
            
            if published is not None:
                update_fields.append('published = %s')
                update_values.append(published)
            
            if published_url is not None:
                update_fields.append('published_url = %s')
                update_values.append(published_url)
            
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            update_values.append(project_id)
            
            query = f"UPDATE projects SET {', '.join(update_fields)} WHERE id = %s RETURNING id, name, preview_url, published, published_url, file_name, file_size, updated_at"
            
            cur.execute(query, tuple(update_values))
            updated_project = cur.fetchone()
            conn.commit()
            
            if not updated_project:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Project not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_project), default=str)
            }
        
        elif method == 'DELETE':
            params = event.get('pathParams', {})
            project_id = params.get('id')
            
            cur.execute("DELETE FROM projects WHERE id = %s RETURNING id", (project_id,))
            deleted = cur.fetchone()
            conn.commit()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Project not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
