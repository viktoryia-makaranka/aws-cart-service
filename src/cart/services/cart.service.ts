import { Injectable } from '@nestjs/common';

import { Cart, DBCart, DBCartItem } from '../models';
import { query } from '../../db';

export enum CartStatus {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
};

const getFirstRow = (rows) => rows?.[0];

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string): Promise<DBCart | undefined> {
    const cartRows = await query<DBCart>(`select * from carts where user_id = '${ userId }'`);

    console.log(cartRows);

    const cart = getFirstRow(cartRows);

    if (!cart) {
      return;
    }

    const cartItemsRows = await query<DBCartItem>(`select * from cart_items where cart_id = '${ cart.id }'`);

    return {
      ...cart,
      items: cartItemsRows.rows.map(item => ({
        ...item,
        product: {
          id: item.product_id
        }
      }))
    };
  };

  async createByUserId(userId: string) {
    const date = new Date().toJSON();

    const columns = 'user_id, created_at, updated_at, status';
    const values = `'${ userId }', '${ date }', '${ date }', '${ CartStatus.OPEN }'`;

    try {
      const addedRows = await query<Cart>(`INSERT INTO carts(${columns}) VALUES(${values}) RETURNING *`);

      return getFirstRow(addedRows);
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  async findOrCreateByUserId(userId: string): Promise<DBCart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart) {
    const cart = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      ...cart,
      items
    }

    try {
      await Promise.all(
          items.map(item => {
            const values = `'${ cart.id }', '${ item.count }', '${ item.product.id }'`;
            return query(`insert into cart_items (cart_id, count, product_id) values(${ values })`);
          }),
      );

      return { ...updatedCart };
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  async removeByUserId(userId) {
    try {
      const { id } = await this.findOrCreateByUserId(userId);
      await query(`DELETE FROM cart_items WHERE cart_id = '${ id }'`);
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
